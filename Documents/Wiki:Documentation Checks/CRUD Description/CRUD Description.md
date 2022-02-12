## description of CRUD operation functions

--------

### function:

#### authentication function:

##### userRegister
- Register a new user. By passing in the username and password, you can add a new user in the system.

##### userLogin
- Login a user given the username and password. The view will perform password validation and the backend will perfom password authentication.


#### user function:

##### getCurrentUserInfo
- Get the user info of the user that is log in now

##### updateUser
- update user info

##### getUsersByGroupId
- return users from one group

##### validateUsername
- check if username is occupied

##### searchUserByName
- search user by name

##### validatePassword
- check if the pwd input is correct

##### getUserById
- given userid, return userinfo

##### updateUserById
- update user info given userid

##### promoteUser
- promote user to admin

##### demoteUser
- demote user from admin

#### post function

##### createPost
- Create new post

##### getPosts
- get posts

##### getPostOfCurUser
- get posts of current user

##### getPostById
- given postid, return postinfo

##### getPostByGroupId
- given postgroupid, return postinfo

##### deletePost
- given postid, delete post

##### createFlag
- create a flag for one post

##### undoAllFlags
- change all flags to unflagged

##### deleteFlags
- given postid, delete flags

##### enableHide
- create a flag for one post

##### checkHiddenStatus
- check hide status of one post

#### Group Functions

##### createGroup
- input group info to create

##### getTrendingGroups
- get trending groups that is not private to show in the page

##### getPublicGroups
- return a list of public groups the user joined

##### getPrivateGroups
- return a list of private groups the user joined

##### getAllTags
- return a list of all tags

##### getGroupByTag
- Given a group id. return a list of all tags

##### getGroupSortTime
- return a list of groups ordered by time with page limit

##### getGroupSortPost
- return a list of groups ordered by post number with page

##### getGroupSortMember
- return a list of groups ordered by member number with page

##### checkGroupStatus
- Given a group id and user id. return its request status

##### checkUserGroupStatus
- Given a group id and user id. return its request status

##### joinGroup
-  User join a group successfully

##### quitGroup
- given user and group id, remove user from thegroup

##### getRequestByUserIdAndGroupId
- Given a group id and user id. return its request status

##### createRequest
- create a request for user to join one group

##### removeRequest
- given user and group id, remove user from thegroup

##### getGroupById
- Given a group id. return the group info

##### updateGroupInfo
- check hide status of one post

##### validateGroupName
- check if the new group name is occupied or not

#### Comment function

##### createComment
- User create a comment on one post

##### getComments
- get comments of one post

##### updateComment
- Given a comment id. update comment

##### deleteComment
- Given a comment id. Delete comment

##### createChat
- User create a chat with another user

##### getChats
- User get all chats

##### getChat
- User get all chats

#### Message Function

##### createMessage
- User create a message with another user

##### getMessage
- User get all messages with another user

#### file functions

##### fileUpload
- file Upload

#### notification function

##### createNotification
- create a notification

##### getNotification
- get notifications of the current user

##### processAdmins
- admin read and process all notifications

##### processClickOneForAll
- set the notification to processed after user read and process them

##### processNotification
- set the notification to processed by id

##### deleteNotification
- set the notification to processed by id
