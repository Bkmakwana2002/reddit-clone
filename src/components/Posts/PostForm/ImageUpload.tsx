import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?: string;
    setSelectedFile: (value: string) => void;
    setSelectedTab: (value: string) => void;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload:React.FC<ImageUploadProps> = ({ selectedFile,onSelectImage,setSelectedFile,setSelectedTab }) => {
    
    const selectedFileRef = useRef<HTMLInputElement>(null)

    return (
        <Flex direction='column' justify='center' align='center' width='100%'>
            { selectedFile ? (<>
            <Image maxWidth='400px' maxHeight='400px' src={selectedFile} />
            <Stack mt={4} mb={4} direction='row'>
              <Button height='28px' onClick={()=>setSelectedTab("Post")}>Back to Post</Button>
              <Button variant='outline' height='28px' onClick={()=>setSelectedFile('')} >Remove</Button>
            </Stack>
            </>) :  <Flex justify='center' align='center' p={20} border='1px dashed' borderColor='gray.200' width='100%' borderRadius={4}>
                <Button variant='outline' height='28px' onClick={()=>selectedFileRef.current?.click()}>Upload</Button>
                <input ref = {selectedFileRef} type='file' hidden onChange={onSelectImage}/>
                <img src={selectedFile}/>
            </Flex>}
        </Flex>
    )
}
export default ImageUpload;