import { useState } from 'react'
import styled from 'styled-components'

import ImageGallery from './ImageGallery'
import ProductPrice from './ProductPrice'
import ProductOptions from './ProductOptions'
import AddToCart from './AddToCart'
import ProductDescription from './ProductDescription'

const ProductDetails = ({ 
  product: {
    options,
    variants: { edges: variants },
    variantBySelectedOptions,
    images,
    title,
    descriptionHtml
  },
  refetchProduct,
  productHandle
}) => {  
  // We can't use the apollo loading state for this because we only want to show
  // the loading state when we're refetching because the user has selected
  // different options, rather than from a refetch of the original apollo query
  // which we want to happen silently.
  const [loadingVariant, setLoadingVariant] = useState(false)
  const [quantitySelected, setQuantitySelected] = useState(1)

  const [selectedOptions, setSelectedOptions] = useState(options
    .reduce((optionsMap, opt) => (
      { ...optionsMap, [opt.name]: opt.values[0] }
    ), {})
  )

  const selectedVariant = variantBySelectedOptions || variants[0].node
  
  // We need to handle invalid variants e.g. if the combination of user selected
  // options doesn't exist in the shopify admin.
  const invalidVariant = !loadingVariant && !Object.values(selectedOptions)
    .every(option => selectedVariant.title.includes(option))

  const onOptionChange = async ({ target: { name, value } }) => {
    const newState = {
      ...selectedOptions,
      [name]: value
    }

    setSelectedOptions(newState)
    setLoadingVariant(true)

    // Get the calculated variant based on our selected options from shopify and 
    // update selected variant in state
    await refetchProduct({ 
      handle: productHandle,
      selectedOptions: Object.keys(newState)
        .map(key => ({ name: key, value: newState[key]}))
    })

    setLoadingVariant(false)
  }

  return (
    <>
      <ProductGrid>
        <ImageGallery 
          selectedVariantImage={selectedVariant.image}
          images={images}
        />

        <ProductInfo>
          <Title>{title}</Title>
          <ProductPrice 
            loadingVariant={loadingVariant}
            invalidVariant={invalidVariant}
            price={selectedVariant.priceV2}
            available={selectedVariant.available}
          />
          
          <ProductOptions 
            options={options}
            onQuantityChange={e => 
              setQuantitySelected(parseInt(e.target.value))
            }
            quantitySelected={quantitySelected}
            selectedOptions={selectedOptions}
            onOptionChange={onOptionChange}
            hasVariants={variants.length > 1}
          />
          
          <AddToCart 
            selectedVariant={selectedVariant}
            invalidVariant={invalidVariant}
            quantitySelected={quantitySelected}
          />

          {descriptionHtml && <ProductDescription html={descriptionHtml} />}
          
        </ProductInfo>
      </ProductGrid>
    </>
  )
}

const ProductGrid = styled.div`${({ theme }) => `
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 30px;

  div:first-child {
    grid-column: 1 / -1;
  }

  div:last-child {
    grid-column: 1 / -1;
  }

  @media (min-width: ${theme.breakpoints.s}) {
    div:first-child {
      grid-column: span 6;
    }

    div:last-child {
      grid-column: span 6;
    }
  }

  @media (min-width: ${theme.breakpoints.m}) {
    div:first-child {
      grid-column: span 5;
    }

    div:last-child {
      grid-column: span 7;
    }
  }
`}`

const ProductInfo = styled.div`${({ theme }) => `
  padding: 10px 0;
`}`

const Title = styled.h2`${({ theme }) => `
  padding: 0 0 20px 0;
  font-size: ${theme.fonts.xl.fontSize};
  line-height: ${theme.fonts.xl.lineHeight};
  text-transform: capitalize;
`}`

export default ProductDetails
