import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import safeJsonStringigy from 'safe-json-stringify';
import { Community } from '../../../atoms/communititesAtom';
import Header from '../../../components/community/Header';
import NotFound from '../../../components/community/NotFound';
import PageContext from '../../../components/Layout/PageContext';
import { firestore } from '../../../firebase/clientApp';

type CommunityPageProps = {
    communityData: Community
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {

    console.log("data", communityData)

    if (!communityData) {
        return (<NotFound />)
    }   

    return (
        <>
            <Header communityData={communityData} />
            <PageContext>
                <>
                    <div>
                          LHS
                    </div>
                </>
                <>
                    <div>
                        RHS
                    </div>
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
                communityData: communityDoc.exists() ? JSON.parse(safeJsonStringigy({ id: communityDoc.id, ...communityDoc.data })) : ''
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export default CommunityPage;