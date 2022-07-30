import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import safeJsonStringigy from 'safe-json-stringify';
import { Community, communityState } from '../../../atoms/communititesAtom';
import About from '../../../components/community/About';
import CreatePostLink from '../../../components/community/CreatePostLink';
import Header from '../../../components/community/Header';
import NotFound from '../../../components/community/NotFound';
import PageContext from '../../../components/Layout/PageContext';
import Posts from '../../../components/Posts/Posts';
import { firestore } from '../../../firebase/clientApp';

type CommunityPageProps = {
    communityData: Community
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {

    console.log("data", communityData)
    const setCommunityStateValue = useSetRecoilState(communityState)

    if (!communityData) {
        return (<NotFound />)
    }   

    useEffect(() => {
      setCommunityStateValue(prev=>({
        ...prev,
        currentCommunity: communityData
      }))
    }, [communityData])
    

    return (
        <>
            <Header communityData={communityData} />
            <PageContext>
                <>
                    <CreatePostLink/>
                    <Posts communityData={communityData}/>
                </>
                <>
                    <About communityData={communityData}/>
                </>
            </PageContext>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string)

        const communityDoc = await getDoc(communityDocRef)

        return {
            props: {
                communityData: communityDoc.exists() ? JSON.parse(safeJsonStringigy({ id: communityDoc.id, ...communityDoc.data() })) : ''
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default CommunityPage;