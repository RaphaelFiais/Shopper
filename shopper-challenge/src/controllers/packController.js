import {
  allPacks,
  findUniquePack,
  packsProduct,
  updatePack,
} from '../repository/packRepository'

export const index = async (req, res) => {
  const packs = await allPacks()
  const newPacks = packs.map((pack) => ({
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
  return res.json(newPacks)
}

export const getPacksProduct = async (req, res) => {
  const { pack_id } = req.params
  const pack = await packsProduct(pack_id)

  const newPacks = pack.map((pack) => ({
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

  return res.json(newPacks)
}

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const { newPriceProduct, pack_id, productCode } = req.body

    const packExist = await findUniquePack(id)

    if (!packExist) {
      return res.json('Pack não encontrado')
    }

    if (Number(packExist.pack_id) !== Number(pack_id)) {
      return res.json('Digite o pack correspondete ao produto selecionado')
    }

    const findPack = await packsProduct(pack_id)

    if (
      Number(packExist.products_packs_product_idToproducts.code) !==
      Number(productCode)
    ) {
      return res.json('Produto não encontrado')
    }

    if (
      packExist.products_packs_product_idToproducts.cost_price > newPriceProduct
    ) {
      return res.json('Preço é menor que o preço de custo')
    }
    let reajuste =
      newPriceProduct -
      packExist.products_packs_product_idToproducts.sales_price
    if (reajuste < 0) {
      reajuste = reajuste * -1
    }
    const limit =
      packExist.products_packs_product_idToproducts.sales_price * 0.1
    if (reajuste !== limit) {
      return res.json('o preço é maior ou menor que 10%')
    }
    const price = findPack
      .map((item) =>
        Number(id) === Number(item.id)
          ? Number(item.qty) * newPriceProduct
          : Number(item.qty) *
            Number(item.products_packs_product_idToproducts.sales_price),
      )
      .reduce((acumulador, valor) => acumulador + valor, 0)
    const pack = await updatePack({
      id,
      newPriceProduct,
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
  } catch (error) {
    return res.json({ error })
  }
}
