import { Timestamp } from 'firebase/firestore';
import React from 'react';

type CommenItemProps = {
    
};

export type Comment = {
    id: string,
    creatorId: string,
    creatorDisplayText: string,
    communityId: string,
    postId: string,
    postTitle: string,
    text: string,
    createdAt: Timestamp
}

const CommenItem:React.FC<CommenItemProps> = () => {
    
    return <div>Have a good coding</div>
}
export default CommenItem;