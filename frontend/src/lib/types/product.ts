
export interface Product {
    name: string;
    id: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    imageUrl: string | null;
    fileName: string | null;
    stock: number;
}


export interface CreateProduct {
  name: string;
  price: number;
  stock: number;
  description: string | null;
  file: null | File;
  imageUrl: string | null;
}