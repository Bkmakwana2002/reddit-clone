import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';
import { communityState } from '../atoms/communititesAtom';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/DirectoryMenuAtom';


const useDirectory = () => {

    const [directoryState,setDirectoryState] = useRecoilState(directoryMenuState)
    const router = useRouter()
    const setCommunityStateValue = useRecoilValue(communityState)

    const onSelectMenuItems = (menuItem: DirectoryMenuItem)=>{
           setDirectoryState((prev)=>({
            ...prev,
            selectedMenuItem: menuItem
           }))
        router.push(menuItem.link)
        if(directoryState.isOpen)
        {
            toggleMenuOpen()
        }
    }

    const toggleMenuOpen = ()=>{
        setDirectoryState(prev=>({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    useEffect(() => {
      const { currentCommunity } = setCommunityStateValue
      if(currentCommunity)
      {
        setDirectoryState(prev=>({
            ...prev,
            selectedMenuItem: { displayText:`r/${currentCommunity.id}`, link: `/r/${currentCommunity.id}`, imageURL: currentCommunity.imageUrl , icon: FaReddit,iconColor:'blue.500' }
        }))
      }
    }, [setCommunityStateValue.currentCommunity])
    
    
    return {
        directoryState,setDirectoryState,toggleMenuOpen,onSelectMenuItems
    }
}
export default useDirectory;