import { getPrisma } from "../../lib/prisma";
import { HttpError } from "../../utils/http-error";

export async function checkoutCart(userId: string) {
  const prisma = getPrisma();

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new HttpError(400, "Carrinho vazio.");
  }

  for (const item of cart.items) {
    if (!item.product.isActive) {
      throw new HttpError(400, `Produto indisponível: ${item.product.name}`);
    }

    if (item.quantity > item.product.stock) {
      throw new HttpError(400, `Estoque insuficiente para: ${item.product.name}`);
    }
  }

  const total = cart.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        }
      },
      include: {
        items: true
      }
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: item.product.stock - item.quantity
        }
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return createdOrder;
  });

  return order;
}

export async function listMyOrders(userId: string) {
  const prisma = getPrisma();
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });
}

export async function listAllOrders() {
  const prisma = getPrisma();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

export async function getOrderById(id: string, userId?: string) {
  const prisma = getPrisma();
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });

  if (!order) {
    throw new HttpError(404, "Pedido não encontrado.");
  }

  if (userId && order.userId !== userId) {
    throw new HttpError(403, "Acesso negado.");
  }

  return order;
}
