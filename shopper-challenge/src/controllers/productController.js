import {
  allPacks,
  packsProduct,
  updatePack,
} from '../repository/packRepository'
import {
  findProduct,
  getProduct,
  updateProduct,
} from '../repository/productRepository'

export const index = async (req, res) => {
  const products = await getProduct()
  const newProducts = products.map((product) => ({
    cost_price: product.cost_price,
    code: product.code.toString(),
    pack_id: product?.packs_packs_product_idToproducts[0]?.pack_id?.toString(),
    sales_price: product.sales_price,
    name: product.name,
  }))

  return res.json(newProducts)
}

export const update = async (req, res) => {
  const { code } = req.params
  const { sales_price } = req.body

  const productExist = await findProduct(code)
  if (!productExist) {
    return res.json('Produto não encontrado')
  }
  /* ------------------Encontrar o pack_id ligado ao produto--------------------- */
  const packs = await allPacks()
  const pack_id = packs
    .map((pack) => ({
      id: pack.id.toString(),
      pack_id: pack.pack_id.toString(),
      product_id: pack.product_id.toString(),
      qty: pack.qty.toString(),
      products_packs_product_idToproducts: {
        ...pack.products_packs_product_idToproducts,
        code: pack.products_packs_product_idToproducts.code.toString(),
      },
      products_packs_pack_idToproducts: {
        ...pack.products_packs_pack_idToproducts,
        code: pack.products_packs_pack_idToproducts.code.toString(),
      },
    }))
    .filter((pack) => pack.product_id.includes(code))[0]?.pack_id

  /* --------------------------------------- */

  if (productExist.cost_price > sales_price) {
    return res.json('Preço é menor que o preço de custo')
  }

  /* --------------------Verificar se o preço corresponde aos 10% ------------------- */

  const reajuste = productExist.sales_price * 0.1
  let limit = productExist.sales_price - sales_price
  if (limit < 0) {
    limit = limit * -1
  }
  console.log(sales_price)
  console.log(reajuste, limit)
  if (reajuste.toFixed(1) !== limit.toFixed(1)) {
    return res.json('o ajuste é maior ou menor que 10%')
  }
  /* --------------------------------------- */

  if (!pack_id) {
    const product = await updateProduct({
      code,
      sales_price,
    })

    const newProduct = {
      ...product,
      code: product.code.toString(),
    }

    return res.json(newProduct)
  }

  /* ------------------Atualizar preço do pack--------------------- */

  const findPack = await packsProduct(pack_id)

  const id = findPack
    .filter((pack) => pack.product_id.toString().includes(code))[0]
    .id.toString()

  const price = findPack
    .map((item) =>
      Number(id) === Number(item.id)
        ? Number(item.qty) * sales_price
        : Number(item.qty) *
          Number(item.products_packs_product_idToproducts.sales_price),
    )
    .reduce((acumulador, valor) => acumulador + valor, 0)
  /* --------------------------------------- */

  const pack = await updatePack({
    id,
    sales_price,
    price,
  })

  const newPack = {
    id: pack.id.toString(),
    pack_id: pack.pack_id.toString(),
    product_id: pack.product_id.toString(),
    qty: pack.qty.toString(),
    products_packs_product_idToproducts: {
      ...pack.products_packs_product_idToproducts,
      code: pack.products_packs_product_idToproducts.code.toString(),
    },
    products_packs_pack_idToproducts: {
      ...pack.products_packs_pack_idToproducts,
      code: pack.products_packs_pack_idToproducts.code.toString(),
    },
  }

  return res.json(newPack)
}
