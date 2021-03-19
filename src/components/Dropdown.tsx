import React, { useCallback, useState } from 'react'
import { IconBaseProps } from 'react-icons'
import OutsideClickHandler from 'react-outside-click-handler'

import {
  DropDownContainer,
  DropDownListContainer,
  DropDownList,
  ListItem
} from '../styles/components/Dropdown'

interface OptionsProps {
  id: number
  name: string
}

interface DropdownProps {
  options: OptionsProps[]
  icon?: React.ComponentType<IconBaseProps>
  onClick: (value: number, indexOption: number, id?: number) => void
  id?: number
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  icon: Icon,
  onClick,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggling = () => setIsOpen(!isOpen)

  const onOptionClicked = useCallback(
    (value, indexOption) => () => {
      setIsOpen(false)
      onClick(value, id, indexOption)
    },
    [isOpen]
  )

  return (
    <DropDownContainer>
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(false)
        }}
      >
        {Icon && <Icon size={20} onClick={toggling} />}

        {isOpen && (
          <DropDownListContainer>
            <DropDownList>
              {options.map((option, index) => (
                <ListItem
                  onClick={onOptionClicked(option.id, index)}
                  key={option.id}
                >
                  {option.name}
                </ListItem>
              ))}
            </DropDownList>
          </DropDownListContainer>
        )}
      </OutsideClickHandler>
    </DropDownContainer>
  )
}

export default Dropdown
