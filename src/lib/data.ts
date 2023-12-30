import { cache } from "react";
import { ProductData } from "@/lib/types";
import { Collection, Db, MongoClient, Document } from "mongodb";
import clientPromise from "@/lib/mongodb";

let client: MongoClient;
let db: Db;
let productsCollection: Collection<ProductData>;

async function initConnection() {
  try {
    client = await clientPromise;
    db = client.db(process.env.MONGODB_DATABASE as string);
    productsCollection = db.collection(
      process.env.MONGODB_COLLECTION as string,
    );
  } catch (error) {
    throw new Error(`[ERROR]: Couldn't connect to mongodb: ${error}`);
  }
}

export type ProductsProjectedData = Pick<
  ProductData,
  "id" | "name" | "imageURL" | "sizes" | "material"
>;

export const getAllProducts = cache(
  async (page: number, limit: number, categories: string[]) => {
    if (!productsCollection) {
      await initConnection();
    }
    const skipVal = (page - 1) * limit;
    const sanitisedCategories = categories.map((category) =>
      category.toLowerCase(),
    );
    console.log(sanitisedCategories);
    try {
      let productCountPromise: Promise<number>;
      const productsPipeline: Document[] = [
        { $sort: { id: 1 } },
        { $skip: skipVal },
        { $limit: limit },
        {
          $project: {
            id: 1,
            name: 1,
            imageURL: 1,
            sizes: 1,
            material: 1,
          },
        },
      ];
      if (sanitisedCategories.length) {
        productCountPromise = productsCollection.countDocuments({
          tags: { $all: sanitisedCategories },
        });
        productsPipeline.unshift({
          $match: { tags: { $all: sanitisedCategories } },
        });
      } else {
        productCountPromise = productsCollection.countDocuments();
      }
      const productsPromise = productsCollection
        .aggregate<ProductsProjectedData>(productsPipeline)
        .toArray();
      const [products, count] = await Promise.all([
        productsPromise,
        productCountPromise,
      ]);
      console.log(count);
      return { products, count };
    } catch (err) {
      console.error("[ERROR] Database Error: ", err);
      throw new Error("Failed to fetch all data");
    }
  },
);

export const getFilteredProducts = cache(
  async (page: number, limit: number, query: string, categories: string[]) => {
    if (!productsCollection) {
      await initConnection();
    }

    const skipVal = (page - 1) * limit;
    const sanitisedCategories = categories.map((category) =>
      category.toLowerCase(),
    );
    const searchPipeline: Document[] = [
      {
        $search: {
          index: "searchProducts",
          autocomplete: {
            query: query,
            path: "name",
          },
          count: { type: "total" },
          returnStoredSource: true,
        },
      },
    ];
    let finalStagePipeline: Document[] = [
      { $skip: skipVal },
      { $limit: limit },
      {
        $project: {
          id: 1,
          name: 1,
          imageURL: 1,
          sizes: 1,
          material: 1,
        },
      },
    ];
    let mainPipeline: Document[] = [];
    if (categories.length > 0) {
      mainPipeline = [
        ...searchPipeline,
        { $match: { tags: { $all: sanitisedCategories } } },
        ...finalStagePipeline,
      ];
    } else {
      mainPipeline = [...searchPipeline, ...finalStagePipeline];
    }
    // let pipeline: Document[] = [
    //   {
    //     $search: {
    //       index: "searchProducts",
    //       autocomplete: {
    //         query: query,
    //         path: "name",
    //       },
    //       count: { type: "total" },
    //       sort: { id: 1 },
    //       returnStoredSource: true,
    //     },
    //   },
    //   { $sort: { id: 1 } },
    //   { $skip: skipVal },
    //   { $limit: limit },
    //   {
    //     $project: {
    //       id: 1,
    //       name: 1,
    //       imageURL: 1,
    //       sizes: 1,
    //       material: 1,
    //     },
    //   },
    // ];
    try {
      const result = await productsCollection
        .aggregate<ProductsProjectedData>(mainPipeline)
        .toArray();
      return result;
    } catch (err) {
      console.error("Error while filtering", err);
      throw new Error("Error while filtering");
    }
  },
);

export const getAllProductsCount = cache(async (categories: string[]) => {
  if (!productsCollection) {
    await initConnection();
  }
  let count: number;
  const sanitisedCategories = categories.map((category) =>
    category.toLowerCase(),
  );
  if (sanitisedCategories.length) {
    count = await productsCollection.countDocuments({
      tags: { $all: categories },
    });
  } else {
    count = await productsCollection.countDocuments();
  }
  return count;
});

export const getFilteredProductsCount = cache(
  async (query: string, categories: string[]) => {
    if (!productsCollection) {
      await initConnection();
    }

    const sanitisedCategories = categories.map((category) =>
      category.toLowerCase(),
    );
    // let pipeline: Document[] = [
    //   {
    //     $searchMeta: {
    //       index: "searchProducts",
    //       autocomplete: {
    //         query: query,
    //         path: "name",
    //       },
    //       count: { type: "total" },
    //       sort: { id: 1 },
    //       returnStoredSource: true,
    //     },
    //   },
    // ];
    let pipeline: Document[] = [
      {
        $searchMeta: {
          index: "searchProducts",
          compound: {
            must: [
              {
                autocomplete: {
                  query: query,
                  path: "name",
                },
              },
            ],
          },
          count: { type: "total" },
          returnStoredSource: true,
        },
      },
    ];
    if (sanitisedCategories.length > 0) {
      let filterString = "";
      for (let i = 0; i < sanitisedCategories.length - 1; ++i) {
        filterString = filterString + sanitisedCategories[i] + " AND ";
      }
      filterString =
        filterString + sanitisedCategories[sanitisedCategories.length - 1];
      pipeline[0].$searchMeta.compound.filter = [
        { queryString: { defaultPath: "tags", query: filterString } },
      ];
    }
    try {
      console.log(pipeline[0].$searchMeta.compound.filter);
      console.log(JSON.stringify(pipeline, null, 2));
      const result = await productsCollection
        .aggregate<{ count: { total: number } }>(pipeline)
        .toArray();
      return result;
    } catch (e) {
      console.error("Error while getting filtered count", e);
      throw new Error("Error while getting filtered count");
    }
  },
);

// need to improve the way I query the data.
// read about mongodb and some querying techniques and other flags to be used. May be don't use aggregation. May be use $facet.
export const getTags = cache(async () => {
  if (!productsCollection) {
    await initConnection();
  }
  const result = productsCollection.distinct("tags");
  return result;
});
