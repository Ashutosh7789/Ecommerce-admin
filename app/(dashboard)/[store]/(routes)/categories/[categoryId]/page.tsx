import { Metadata } from 'next';

import prismadb from '@/lib/prismadb';
import { CategoryForm } from '../components/category-form';

export const metadata: Metadata = {
    title: "Admin | Category",
    description: "Admin Individual Category",
};


interface CategoryPageProps {
    params: {
        categoryId: string,
        store: string,
    }
};

const CategoryPage: React.FC<CategoryPageProps> = async ({
    params
}) => {

    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId,
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: params.store,
        }
    });


  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <CategoryForm
                billboards={billboards}
                initialData={category}
            />
        </div>
    </div>
  )
}

export default CategoryPage;
