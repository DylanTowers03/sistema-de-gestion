import axios from "axios";
import {
  Product,
  ProductFormDataUpdate,
  Tipos,
  Categorias,
  Client,
  Proveedor,
  Negocio,
  TipoNegocio,
  FacturaFormData,
  Empleado,
  NegocioSuperAdmin,
} from "@/types/types";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000/";

export async function crearFactura(
  FacturaFormData: FacturaFormData,
  token: string
) {
  const response = await axios.post(
    `${BACKEND_URL}productos/api/factura/`,
    FacturaFormData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getProducts(token: string): Promise<Product[]> {
  const response = await axios.get(`${BACKEND_URL}productos/api/producto/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createProduct(
  data: Omit<Product, "id">,
  token: string
): Promise<Product> {
  const response = await axios.post(
    `${BACKEND_URL}productos/api/producto/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateProduct(
  data: Partial<ProductFormDataUpdate>,
  token: string
): Promise<Product> {
  const response = await axios.patch(
    `${BACKEND_URL}productos/api/producto/${data.id}/`,
    {
      id: data.id,
      nombreProducto: data.productName,
      descripcion: data.description,
      stockActual: data.currentStock,
      stockMin: data.minStock,
      stockMax: data.maxStock,
      unidadMedida: data.unitOfMeasure,
      precioVenta: data.salePrice,
      category: data.category,
      type: data.type,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Check if the response is successful

  return response.data;
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}productos/api/producto/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createTipo(
  data: Omit<Tipos, "id">,
  token: string
): Promise<Tipos> {
  const response = await axios.post(
    `${BACKEND_URL}productos/api/tipo-producto/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getTipos(token: string): Promise<Tipos[]> {
  const response = await axios.get(
    `${BACKEND_URL}productos/api/tipo-producto/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateTipo(
  data: Partial<Tipos>,
  token: string
): Promise<Tipos> {
  const response = await axios.patch(
    `${BACKEND_URL}productos/api/tipo-producto/${data.id}/`,
    {
      id: data.id,
      nombreTipoProducto: data.nombreTipoProducto,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteTipo(id: number, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}productos/api/tipo-producto/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getCategorias(token: string): Promise<Categorias[]> {
  const response = await axios.get(
    `${BACKEND_URL}productos/api/categoria-producto/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function createCategoria(
  data: Omit<Categorias, "id">,
  token: string
): Promise<Categorias> {
  const response = await axios.post(
    `${BACKEND_URL}productos/api/categoria-producto/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateCategoria(
  data: Partial<Categorias>,
  token: string
): Promise<Categorias> {
  const response = await axios.patch(
    `${BACKEND_URL}productos/api/categoria-producto/${data.id}/`,
    {
      id: data.id,
      nombreCategoria: data.nombreCategoria,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteCategoria(
  id: number,
  token: string
): Promise<void> {
  await axios.delete(`${BACKEND_URL}productos/api/categoria-producto/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getTiposAndCategorias(
  token: string
): Promise<{ tipos: Tipos[]; categorias: Categorias[] }> {
  const [tiposResponse, categoriasResponse] = await Promise.all([
    axios.get(`${BACKEND_URL}productos/api/tipo-producto/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),
    axios.get(`${BACKEND_URL}productos/api/categoria-producto/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }),
  ]);

  return {
    tipos: tiposResponse.data,
    categorias: categoriasResponse.data,
  };
}

export async function getClients(token: string): Promise<Client[]> {
  const response = await axios.get(`${BACKEND_URL}clientes/api/clientes/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createClient(
  data: Omit<Client, "id">,
  token: string
): Promise<Client> {
  const response = await axios.post(
    `${BACKEND_URL}clientes/api/clientes/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
export async function updateClient(
  data: Client,
  token: string
): Promise<Client> {
  const response = await axios.patch(
    `${BACKEND_URL}clientes/api/clientes/${data.id}/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteClient(id: string, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}clientes/api/clientes/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getProveedores(token: string): Promise<Proveedor[]> {
  const response = await axios.get(
    `${BACKEND_URL}proveedores/api/proveedores/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function createProveedor(
  data: Omit<Proveedor, "id">,
  token: string
): Promise<Proveedor> {
  const response = await axios.post(
    `${BACKEND_URL}proveedores/api/proveedores/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateProveedor(
  data: Partial<Proveedor>,
  token: string
): Promise<Proveedor> {
  const response = await axios.patch(
    `${BACKEND_URL}proveedores/api/proveedores/${data.id}/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteProveedor(
  id: string,
  token: string
): Promise<void> {
  await axios.delete(`${BACKEND_URL}proveedores/api/proveedores/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function assingProveedorToProducto(
  productoId: number[],
  proveedorId: number,
  token: string
): Promise<void> {
  const response = await axios.post(
    `${BACKEND_URL}proveedores/api/proveedor-productos/`,
    {
      producto: productoId,
      proveedor: proveedorId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getMiNegocio(token: string): Promise<Negocio> {
  const response = await axios.get(`${BACKEND_URL}negocios/api/negocios/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createNegocio(
  data: Omit<Negocio, "id">,
  token: string
): Promise<Negocio> {
  const response = await axios.post(
    `${BACKEND_URL}negocios/api/negocios/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateNegocio(
  data: Partial<Negocio>,
  token: string
): Promise<Negocio> {
  const response = await axios.patch(
    `${BACKEND_URL}negocios/api/negocios/${data.id}/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteNegocio(id: string, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}negocios/api/negocios/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getTiposNegocio(token: string): Promise<TipoNegocio[]> {
  const response = await axios.get(`${BACKEND_URL}negocios/api/tipo-negocio/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createTipoNegocio(
  data: Omit<TipoNegocio, "id">,
  token: string
): Promise<TipoNegocio> {
  const response = await axios.post(
    `${BACKEND_URL}negocios/api/tipo-negocio/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function updateTipoNegocio(
  data: Partial<TipoNegocio>,
  token: string
): Promise<TipoNegocio> {
  const response = await axios.patch(
    `${BACKEND_URL}negocios/api/tipo-negocio/${data.id}/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteTipoNegocio(
  id: string,
  token: string
): Promise<void> {
  await axios.delete(`${BACKEND_URL}negocios/api/tipo-negocio/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUsuarioNegocio(
  token: string,
  idUser: number
): Promise<Negocio[]> {
  const response = await axios.get(
    `${BACKEND_URL}negocios/api/usuario-negocio/${idUser}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getEmpleados(token: string): Promise<Empleado[]> {
  const response = await axios.get(`${BACKEND_URL}empleados/api/empleados/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.empleados;
}

export async function createEmpleados(
  data: Empleado,
  token: string
): Promise<Empleado> {
  const response = await axios.post(
    `${BACKEND_URL}empleados/api/empleados/`,
    {
      user: {
        correo: data.correo,
        password: data.password,
        nombre: data.nombre,
      },
      salario: data.salario,
      negocio: data.negocio,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getSuperAdminNegocios(
  token: string
): Promise<NegocioSuperAdmin[]> {
  const response = await axios.get(
    `${BACKEND_URL}negocios/api/negocios-super-admin/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.negocios;
}
