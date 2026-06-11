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
    { name: "Orders" },
    { name: "Admin" }
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
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "User created" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        responses: {
          "200": { description: "Authenticated" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user" }
        }
      }
    },
    "/products": {
      get: {
        tags: ["Products"],
        responses: {
          "200": { description: "Product list" }
        }
      }
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Product detail" }
        }
      }
    }
  }
};
