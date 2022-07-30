import { Box, Flex, Icon } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { FaReddit } from 'react-icons/fa';

type CommenItemProps = {
    comment: Comment;
    onDeleteComment: (comment: Comment) => void;
    loadingDelete: boolean;
    userId: string;

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

const CommenItem: React.FC<CommenItemProps> = ({ comment, onDeleteComment, loadingDelete, userId }) => {

    return (
       <Flex>
          <Box>
            <Icon as={FaReddit} />
          </Box>
       </Flex>
    )
}
export default CommenItem;