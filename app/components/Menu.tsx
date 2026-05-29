import { ProductCard, type Product } from "./ProductCard";

// 1. Бэкэндээс ирэх датаны TypeScript төрлийг зааж өгнө
interface BackendCategory {
  id: string;
  categoryName: string; // Багшийн код дээр 'title' байсан
  foods: {
    id: string;
    foodName: string; // Багшийн код дээр 'name' байсан
    description: string;
    price: number; // Манай бэкэнд дээр тоо (number) байгаа
    image: string;
  }[];
}

// 2. Бэкэнд API-аас дата татах функц
async function getMenuData() {
  // Өөрийн бэкэнд API хаягийг дуудна
  const res = await fetch("http://localhost:3000/api/categories", {
    cache: "no-store", // Үргэлж шинэ дата авч байх утас
  });

  if (!res.ok) {
    throw new Error("Хоолны цэсний датаг татаж чадсангүй");
  }

  return res.json() as Promise<BackendCategory[]>;
}

// 3. Компонентоо 'async' болгоно
export async function Menu() {
  const sections = await getMenuData();

  return (
    <section className="bg-primary">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-6 py-14 sm:px-12 lg:px-[88px]">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-6">
            {/* Категорийн нэр (Манай бэкэндээс categoryName ирнэ) */}
            <h2 className="text-[30px] font-semibold leading-9 tracking-tight text-white">
              {section.categoryName}
            </h2>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
              {section.foods.map((food) => {
                // 4. Манай бэкэнд датаг багшийн ProductCard-д тохируулж хөрвүүлнэ (Mapping)
                const mappedProduct: Product = {
                  id: food.id,
                  name: food.foodName,
                  description:
                    food.description || "Орц найрлага байхгүй байна.",
                  price: `$${food.price.toFixed(2)}`, // Тоог $12.99 формат руу хөрвүүлэх
                  image: food.image || "/uploads/placeholder.jpg", // Зураггүй бол placeholder
                };

                return <ProductCard key={food.id} product={mappedProduct} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
