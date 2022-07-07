export class CommentsRepositorySub {
    constructor() {
        this.editComment = jest.fn()
        this.getCommentsForPr = jest.fn()
    }

    enqueueEditComment(editCommentImplementation) {
        this.editComment = jest.fn(editCommentImplementation)
    }

    enqueueEditCommentError(error) {
        this.editComment = jest.fn(async () => {
            throw error
        })
    }

    enqueueCommentsForPr(comments) {
        this.getCommentsForPr = jest.fn(() => comments)
    }
}
