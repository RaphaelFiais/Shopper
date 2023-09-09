import { prisma } from '../services/prisma'

export const allPacks = () => {
  return prisma.packs.findMany({
    select: {
      id: true,
      pack_id: true,
      product_id: true,
      qty: true,
      products_packs_pack_idToproducts: true,
      products_packs_product_idToproducts: true,
    },
  })
}

export const packsProduct = (product_id) => {
  return prisma.packs.findMany({
    where: { product_id },
    select: {
      id: true,
      pack_id: true,
      product_id: true,
      qty: true,
      products_packs_product_idToproducts: true,
      products_packs_pack_idToproducts: true,
    },
  })
}
export const findUniquePack = (id) => {
  return prisma.packs.findUnique({
    where: { id },
    select: {
      id: true,
      pack_id: true,
      product_id: true,
      qty: true,
      products_packs_product_idToproducts: {
        select: {
          code: true,
          cost_price: true,
          sales_price: true,
        },
      },
    },
  })
}

export const updatePack = (data) => {
  return prisma.packs.update({
    where: {
      id: data.id,
    },
    data: {
      products_packs_product_idToproducts: {
        update: {
          sales_price: data.sales_price,
        },
      },
      products_packs_pack_idToproducts: {
        update: {
          sales_price: data.price,
        },
      },
    },
    select: {
      id: true,
      pack_id: true,
      product_id: true,
      qty: true,
      products_packs_product_idToproducts: true,
      products_packs_pack_idToproducts: true,
    },
  })
}
