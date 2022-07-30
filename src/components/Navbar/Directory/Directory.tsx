import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Icon, Image, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react'
import React from 'react'
import { TiHome } from 'react-icons/ti'
import useDirectory from '../../../hooks/useDirectory'
import Communites from './Communites'

const UserMenu: React.FC = () => {

   const { directoryState,setDirectoryState,toggleMenuOpen } = useDirectory()

    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton onClick={toggleMenuOpen} mr={2} ml={{ base:0, md:2 }} cursor='pointer' padding='0px 6px' borderRadius={4} _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>
                <Flex align='center' justify='space-between' width={{ base:'auto', lg:'200px' }}>
                    <Flex align='center'>
                        {directoryState.selectedMenuItem.imageURL ? (
                            <Image borderRadius='full' boxSize='24px' mr={2} src={directoryState.selectedMenuItem.imageURL} />
                        ):(
                            <Icon fontSize={24} mr={{ base:1, md:2 }} as={directoryState.selectedMenuItem.icon} color={directoryState.selectedMenuItem.iconColor}/>
                        )}
                         <Flex display={{ base:'none', lg:'flex'}}>
                         <Text fontWeight={600} fontSize='10pt'>{directoryState.selectedMenuItem.displayText}</Text>
                         </Flex>
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
              <Communites/>
            </MenuList>
        </Menu>
    )
}
export default UserMenu;