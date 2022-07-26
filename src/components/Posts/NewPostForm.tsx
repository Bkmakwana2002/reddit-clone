import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '../../atoms/postAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router'
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

type NewPostFormProps = {
  user: User
};

const formTabs: Tabitem[] = [
  {
    title: 'Post',
    icon: IoDocumentText
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline
  },
  {
    title: 'Link',
    icon: BsLink45Deg
  },
  {
    title: 'Poll',
    icon: BiPoll
  },
  {
    title: 'Talk',
    icon: BsMic
  },
]

export type Tabitem = {
  title: string,
  icon: typeof Icon.arguments
}

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {

  const router = useRouter()

  const [textInputs, setTextInputs] = useState({
    title: '',
    body: ''
  })

  const [selectedFile, setSelectedFile] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const handleCreatePost = async () => {

    const { communityId } = router.query
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp
    }
    setLoading(true)

    try {

      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)

      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imageRef, selectedFile, 'data_url')

        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(postDocRef, {
          imageUrl: downloadUrl
        })
      }

    } catch (error: any) {
      console.log("post error", error.message)
      setError(true)
    }
    setLoading(false)
    //router.back()
  }

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files?.[0])
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string)
      }
    }
  }

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { target: { name, value } } = event
    setTextInputs(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex mt={7}>
        {selectedTab === 'Post' && <TextInputs textInputs={textInputs}
          onChange={onTextChange}
          handleCreatePost={handleCreatePost}
          loading={loading} />}
        {selectedTab === 'Images & Video' && (
          <ImageUpload setSelectedFile={setSelectedFile} selectedFile={selectedFile} onSelectImage={onSelectImage}
            setSelectedTab={setSelectedTab} />
        )}
      </Flex>
      {error &&
        (<Alert status='error'>
          <AlertIcon />
          <Text mr={2}>Error creating Post</Text>
        </Alert>)
      }
    </Flex>
  )
}
export default NewPostForm;