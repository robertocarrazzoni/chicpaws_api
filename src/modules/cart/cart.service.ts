import { getPrisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";

async function getOrCreateCart(userId: string) {
  const prisma = getPrisma();
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (cart) {
    return cart;
  }

  return prisma.cart.create({
    data: { userId }
  });
}

export async function getCart(userId: string) {
  const prisma = getPrisma();
  const cart = await getOrCreateCart(userId);

  const fullCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: {
            include: { category: true }
          }
        }
      }
    }
  });

  if (!fullCart) {
    throw new HttpError(404, "Carrinho não encontrado.");
  }

  const items = fullCart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
    product: item.product
  }));

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: fullCart.id,
    items,
    total
  };
}

export async function addItemToCart(userId: string, input: { productId: string; quantity: number }) {
  const prisma = getPrisma();
  const cart = await getOrCreateCart(userId);
  const product = await prisma.product.findUnique({ where: { id: input.productId } });

  if (!product || !product.isActive) {
    throw new HttpError(404, "Produto não encontrado.");
  }

  if (input.quantity > product.stock) {
    throw new HttpError(400, "Quantidade indisponível em estoque.");
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: product.id
      }
    }
  });

  if (existing) {
    const quantity = existing.quantity + input.quantity;

    if (quantity > product.stock) {
      throw new HttpError(400, "Quantidade indisponível em estoque.");
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity,
        unitPrice: product.price
      }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: input.quantity,
        unitPrice: product.price
      }
    });
  }

  return getCart(userId);
}

export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  const prisma = getPrisma();
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id
    },
    include: {
      product: true
    }
  });

  if (!item) {
    throw new HttpError(404, "Item do carrinho não encontrado.");
  }

  if (quantity > item.product.stock) {
    throw new HttpError(400, "Quantidade indisponível em estoque.");
  }

  await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity }
  });

  return getCart(userId);
}

export async function removeCartItem(userId: string, itemId: string) {
  const prisma = getPrisma();
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id
    }
  });

  if (!item) {
    throw new HttpError(404, "Item do carrinho não encontrado.");
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
  return getCart(userId);
}
