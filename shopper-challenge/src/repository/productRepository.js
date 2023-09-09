import { prisma } from '../services/prisma'

export const getProduct = () => {
  return prisma.products.findMany({
    select: {
      code: true,
      cost_price: true,
      name: true,
      sales_price: true,
      packs_packs_product_idToproducts: true,
    },
  })
}

export const findProduct = (code) => {
  return prisma.products.findUnique({
    where: {
      code,
    },
  })
}

export const findManyProduct = (code) => {
  return prisma.products.findMany({
    where: {
      code,
    },
  })
}

export const updateProduct = (data) => {
  console.log(data)
  return prisma.products.update({
    where: {
      code: data.code,
    },
    data: {
      sales_price: data.sales_price,
    },
    select: {
      code: true,
      cost_price: true,
      name: true,
      sales_price: true,
      packs_packs_pack_idToproducts: {
        select: {
          pack_id: true,
          product_id: true,
          qty: true,
        },
      },
    },
  })
}
