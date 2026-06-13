const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" }
};

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ChicPaws Ecommerce API",
    version: "1.0.0",
    description: "API de ecommerce em TypeScript para portfólio freelancer."
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Products" },
    { name: "Categories" },
    { name: "Cart" },
    { name: "Orders" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string" }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      CategoryWithCount: {
        allOf: [
          { $ref: "#/components/schemas/Category" },
          {
            type: "object",
            properties: {
              _count: {
                type: "object",
                properties: {
                  products: { type: "integer" }
                }
              }
            }
          }
        ]
      },
      ProductCategory: {
        $ref: "#/components/schemas/Category"
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          sku: { type: "string" },
          price: { type: "number" },
          stock: { type: "integer" },
          imageUrl: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          categoryId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          category: { $ref: "#/components/schemas/Category" }
        }
      },
      ProductListResponse: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" }
          },
          page: { type: "integer" },
          limit: { type: "integer" },
          total: { type: "integer" }
        }
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          quantity: { type: "integer" },
          unitPrice: { type: "number" },
          subtotal: { type: "number" },
          product: { $ref: "#/components/schemas/Product" }
        }
      },
      Cart: {
        type: "object",
        properties: {
          id: { type: "string" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" }
          },
          total: { type: "number" }
        }
      },
      CartResponse: {
        type: "object",
        properties: {
          cart: { $ref: "#/components/schemas/Cart" }
        }
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderId: { type: "string" },
          productId: { type: "string", nullable: true },
          productName: { type: "string" },
          quantity: { type: "integer" },
          unitPrice: { type: "number" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      OrderUser: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string" }
        }
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          status: { type: "string" },
          total: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" }
          },
          user: { $ref: "#/components/schemas/OrderUser" }
        }
      },
      OrderListResponse: {
        type: "object",
        properties: {
          orders: {
            type: "array",
            items: { $ref: "#/components/schemas/Order" }
          }
        }
      },
      CategoryListResponse: {
        type: "object",
        properties: {
          categories: {
            type: "array",
            items: { $ref: "#/components/schemas/CategoryWithCount" }
          }
        }
      },
      OrderResponse: {
        type: "object",
        properties: {
          order: { $ref: "#/components/schemas/Order" }
        }
      },
      ProductResponse: {
        type: "object",
        properties: {
          product: { $ref: "#/components/schemas/Product" }
        }
      },
      CategoryResponse: {
        type: "object",
        properties: {
          category: { $ref: "#/components/schemas/Category" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        responses: {
          "200": {
            description: "Ok"
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 120 },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8, maxLength: 72 }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                minProperties: 1,
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 120 },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8, maxLength: 72 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "409": { description: "Email already in use" }
        }
      },
      delete: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "409": { description: "User has linked orders" }
        }
      }
    },
    "/products": {
      get: {
        tags: ["Products"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 }
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 12 }
          },
          {
            name: "categoryId",
            in: "query",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Product list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductListResponse" }
              }
            }
          }
        }
      }
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        parameters: [idParam],
        responses: {
          "200": {
            description: "Product detail",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          },
          "404": { description: "Product not found" }
        }
      }
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        responses: {
          "200": {
            description: "Category list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryListResponse" }
              }
            }
          }
        }
      }
    },
    "/cart": {
      get: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current cart",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" }
              }
            }
          }
        }
      }
    },
    "/cart/items": {
      post: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer", minimum: 1 }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Item added",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" }
              }
            }
          }
        }
      }
    },
    "/cart/items/{id}": {
      patch: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: {
                  quantity: { type: "integer", minimum: 1 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Item updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Cart"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "Item removed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CartResponse" }
              }
            }
          }
        }
      }
    },
    "/orders/checkout": {
      post: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "201": {
            description: "Order created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" }
              }
            }
          }
        }
      }
    },
    "/orders/me": {
      get: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user orders",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderListResponse" }
              }
            }
          }
        }
      }
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "Order detail",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderResponse" }
              }
            }
          },
          "403": { description: "Forbidden" },
          "404": { description: "Order not found" }
        }
      }
    },
    "/admin/products": {
      get: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Admin product list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductListResponse" }
              }
            }
          }
        }
      },
      post: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description", "sku", "price", "stock", "categoryId"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 150 },
                  description: { type: "string", minLength: 10, maxLength: 1000 },
                  sku: { type: "string", minLength: 3, maxLength: 50 },
                  price: { type: "number", minimum: 0.01 },
                  stock: { type: "integer", minimum: 0 },
                  imageUrl: { type: "string", format: "uri" },
                  categoryId: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Product created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          }
        }
      }
    },
    "/admin/products/{id}": {
      patch: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                minProperties: 1,
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 150 },
                  description: { type: "string", minLength: 10, maxLength: 1000 },
                  sku: { type: "string", minLength: 3, maxLength: 50 },
                  price: { type: "number", minimum: 0.01 },
                  stock: { type: "integer", minimum: 0 },
                  imageUrl: { type: "string", format: "uri" },
                  categoryId: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Product updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "Product deactivated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductResponse" }
              }
            }
          }
        }
      }
    },
    "/admin/categories": {
      post: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 100 },
                  description: { type: "string", maxLength: 255 }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Category created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryResponse" }
              }
            }
          }
        }
      }
    },
    "/admin/categories/{id}": {
      patch: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                minProperties: 1,
                properties: {
                  name: { type: "string", minLength: 2, maxLength: 100 },
                  description: { type: "string", maxLength: 255 }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Category updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Categories"],
        security: [{ bearerAuth: [] }],
        parameters: [idParam],
        responses: {
          "200": {
            description: "Category removed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" }
              }
            }
          }
        }
      }
    },
    "/admin/orders": {
      get: {
        tags: ["Orders"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "All orders",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderListResponse" }
              }
            }
          }
        }
      }
    }
  }
};
