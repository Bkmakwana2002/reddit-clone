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
    isModerator?: boolean;
    imageURL?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[]
    currentCommunity?:Community,
    snippetsFetched: boolean
}

export const defaultCommunity: Community = {
    id: "",
    creatorId: "",
    numberOfmembers: 0,
    privacyType: "public",
  };

const defaultCommunityState:CommunityState = {
    mySnippets : [],
    currentCommunity: defaultCommunity,
    snippetsFetched: false
} 

export const communityState = atom<CommunityState>({
    key: 'communitiesState',
    default: defaultCommunityState
})