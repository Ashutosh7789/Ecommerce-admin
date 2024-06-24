import { Metadata } from 'next';

import prismadb from '@/lib/prismadb';
import { ProductForm } from '../components/product-form';

export const metadata: Metadata = {
    title: 'Admin | Product',
    description: "Admin Individual Product Form Page"
};

interface ProductPageProps {
    params: {
        productId: string,
        store: string
    }
};

const ProductPage: React.FC<ProductPageProps> = async ({
    params
}) => {

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include:{
            images: true,
        }
    });

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.store,
        }
    });

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.store,
        }
    });

    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.store,
        }
    });


  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <ProductForm 
                initialData={product} 
                sizes={sizes}
                colors={colors}
                categories={categories}
            />
        </div>
    </div>
  )
}

export default ProductPage;
