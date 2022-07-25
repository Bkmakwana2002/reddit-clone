import { Timestamp } from 'firebase/firestore'
import { atom } from 'recoil'

export interface Community {
    id: string;
    creatorId : string;
    numberOfmembers : number;
    privacyType : 'public' | 'restricted' | 'private';
    createdAt ?: Timestamp;
    imageUrl? :string;
}

export interface CommunitySnippet{
    communityId : string;
    isModerator?: true;
    imageURL?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[]
    // visitedCommunity
}

const defaultCommunityState:CommunityState = {
    mySnippets : []
} 

export const communityState = atom<CommunityState>({
    key: 'communitiesState',
    default: defaultCommunityState
})