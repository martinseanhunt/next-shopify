import { useState } from 'react'
import styled from 'styled-components'

import ProductImage from '../common/ProductImage'

const ImageGallery = ({ selectedVariantImage, images }) => {
  const [selectedImage, setSelectedImage] = useState(selectedVariantImage
    ? selectedVariantImage
    : images.edges[0] && images.edges[0].node.image
  )

  return (
    <div>
      <ProductImage 
        image={selectedImage}
        autoHeight
      />
      <SmallImages>
        {images.edges
          // Filter out the currently selected image
          .filter(({ node }) => 
            node.transformedSrc !== selectedImage.transformedSrc
          )
          .map(({ node }) => (
            <button 
              key={node.transformedSrc}
              onClick={() => setSelectedImage(node)}
            >
              <img src={node.transformedSrc} alt={node.altText} />
            </button>
          ))
        }
      </SmallImages>
    </div>
  )
}

const SmallImages = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 10px;
  margin-top: 10px;

  button {
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    cursor: pointer;
  }

  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover;
    height: 120px;
  }
`

export default ImageGallery
