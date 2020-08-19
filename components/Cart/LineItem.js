import styled from 'styled-components'

const LineItem = ({ 
  onUpdateQuantity,
  onDeleteItem,
  updateCartLoading,
  updatingItemId,
  deletingItemId,
  item: {
    variant,
    title,
    quantity
  } 
}) => (
  <Item>
    {variant.image 
      ? <img src={variant.image.transformedSrc} alt={title} />
      : <Placeholder />
    }

    <div>
      <h4>
        {title}
        {variant.title !== 'Default Title' && (
          <span> ({variant.title})</span>
        )}
      </h4>
      <Controls>
        <Quantity>
          <button 
            onClick={() => onUpdateQuantity(
              variant.id, 
              quantity - 1
            )}
            disabled={updateCartLoading || quantity < 2}
          >
            -
          </button>
          <span>
            {variant.id === updatingItemId 
              ? '...' 
              : quantity
            }
          </span>
          <button 
            onClick={() => onUpdateQuantity(
              variant.id, 
              quantity + 1
            )}
            disabled={updateCartLoading}
          >
            +
          </button>
        </Quantity>
        <Delete 
          disabled={updateCartLoading}
          onClick={() => onDeleteItem(variant.id)}
        >
          {variant.id === deletingItemId ? '...' : 'x'}
        </Delete>
      </Controls>
    </div>
  </Item>
)

// TODO: The styles here needs some work, use and extend other common components

const Item = styled.div`${({ theme }) => `
  display: grid;
  grid-template-columns: 70px 1fr;
  margin-bottom: 15px;
  grid-gap: 15px;
  text-align: left;
  align-items: center;

  img  { 
    width: 100%;
    height: 70px;
    object-fit: cover;
  }

  h4 {
    font-size: ${theme.fonts.s.fontSize};
    font-weight: ${theme.fonts.weights.bold};
    color: ${theme.colors.darkGrey};
    padding-bottom: 13px;

    a:hover {
      text-decoration: underline;
    }

    span {
      font-weight: ${theme.fonts.weights.medium};
      color: ${theme.colors.medDarkGrey};
    }
  }
`}`

// TODO: Use ProductImage component for this - it needs a few tweaks first
// and I don't have time right now.
const Placeholder = styled.div`
  background: ${({ theme }) => theme.colors.lightGrey};
  height: 70px;
  width: 100%;
`

const Controls = styled.div`${({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    cursor: pointer;
    border: 1px solid ${theme.colors.medGrey};
    background: ${theme.colors.beigeHighlight};
    font-size: ${theme.fonts.m.fontSize};
    padding: 3px 8px;
    transition: scale: 0.2s;

    &:disabled {
      cursor: default;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
`}`

const Quantity = styled.div`${({ theme }) => `
  display: flex;
  align-items: center;

  button {
    &:first-child {
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
  }

  span {
    border-top: 1px solid ${theme.colors.medGrey};
    border-bottom: 1px solid ${theme.colors.medGrey};
    background: ${theme.colors.beigeHighlight};
    padding: 4px 8px;
  }
`}`

const Delete = styled.button`
  border-radius: 20px;
`

export default LineItem
