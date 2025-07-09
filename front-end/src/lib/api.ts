import axios from "axios";
import { Product, ProductFormDataUpdate,Tipos,Categorias } from "@/types/types"
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000/";


export async function getProducts(token: string): Promise<Product[]> {
  const response = await axios.get(`${BACKEND_URL}productos/api/producto/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  
  
  return response.data;
}


export async function createProduct(data: Omit<Product, 'id'>, token: string): Promise<Product> {
  const response = await axios.post(`${BACKEND_URL}productos/api/producto/`, data,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

    return response.data;

}

export async function updateProduct(data: Partial<ProductFormDataUpdate>, token: string): Promise<Product> {
  const response = await axios.patch(`${BACKEND_URL}productos/api/producto/${data.id}/`, {
    id: data.id,
    nombreProducto: data.productName,
    descripcion: data.description,
    stockActual: data.currentStock,
    stockMin: data.minStock,
    stockMax: data.maxStock,
    unidadMedida: data.unitOfMeasure,
    precioVenta: data.salePrice,
    category: data.category,
    type: data.type
  },{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  // Check if the response is successful

    return response.data;

}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}productos/api/producto/${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}


export async function createTipo(data: Omit<Tipos, 'id'>, token: string): Promise<Tipos> {
  const response = await axios.post(`${BACKEND_URL}productos/api/tipo-producto/`, data,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

    return response.data;
}

export async function getTipos(token: string): Promise<Tipos[]> {
  const response = await axios.get(`${BACKEND_URL}productos/api/tipo-producto/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
}

export async function updateTipo(data: Partial<Tipos>, token: string): Promise<Tipos> {
  const response = await axios.patch(`${BACKEND_URL}productos/api/tipo-producto/${data.id}/`, {
    id: data.id,
    nombreTipoProducto: data.nombreTipoProducto
  },{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });  

  return response.data;
}




export async function deleteTipo(id: number, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}productos/api/tipo-producto/${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

export async function getCategorias(token: string): Promise<Categorias[]> {
  const response = await axios.get(`${BACKEND_URL}productos/api/categoria-producto/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
}



export async function createCategoria(data: Omit<Categorias, 'id'>, token: string): Promise<Categorias> {
  const response = await axios.post(`${BACKEND_URL}productos/api/categoria-producto/`, data,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

    return response.data;
}

export async function updateCategoria(data: Partial<Categorias>, token: string): Promise<Categorias> {
  const response = await axios.patch(`${BACKEND_URL}productos/api/categoria-producto/${data.id}/`, {
    id: data.id,
    nombreCategoria: data.nombreCategoria
  },{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });  

  return response.data;
}

export async function deleteCategoria(id: number, token: string): Promise<void> {
  await axios.delete(`${BACKEND_URL}productos/api/categoria-producto/${id}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}

export async function getTiposAndCategorias(token: string): Promise<{ tipos: Tipos[], categorias: Categorias[] }> {
  const [tiposResponse, categoriasResponse] = await Promise.all([
    axios.get(`${BACKEND_URL}productos/api/tipo-producto/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }),
    axios.get(`${BACKEND_URL}productos/api/categoria-producto/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  ]);  

  return {
    tipos: tiposResponse.data,
    categorias: categoriasResponse.data
  };
}


