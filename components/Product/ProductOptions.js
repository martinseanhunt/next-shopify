import styled from 'styled-components'

const ProductOptions = ({ 
  options,
  quantitySelected,
  onQuantityChange,
  selectedOptions,
  onOptionChange,
  hasVariants
}) => (
  <>
    <Options>
      {hasVariants && options.map(({ name, values }) => (
        <label htmlFor={name} key={name}>{name}: 
          <select 
            name={name} 
            id={name} 
            value={selectedOptions[name]}
            onChange={onOptionChange}
          >
            {values.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      ))}

      <label htmlFor="quantity">Quantity: 
        <input 
          value={quantitySelected} 
          id="quantity" 
          type="number"
          min="1"
          onChange={onQuantityChange}
        />
      </label>
    </Options>
  </>
)

const Options = styled.div`${({ theme }) => `
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(200px, 270px));
  grid-column-gap: 15px;
  grid-row-gap: 20px;
  margin-bottom: 25px;

  label {
    color: ${theme.colors.medDarkGrey};
    font-weight: ${theme.fonts.weights.medium};
  }

  select, input { 
    display: block; 
    width: 100%;
    padding: 7px;
    background: ${theme.colors.lightBeige};
    border: 1px solid ${theme.colors.beigeHighlight};
    border-radius: 5px;
    margin-top: 5px;
  }
`}`

export default ProductOptions
