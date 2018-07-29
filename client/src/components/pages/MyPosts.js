import React from 'react';
import * as actions from '../../actions/postsActions';
import {connect} from 'react-redux';

class MyPosts extends React.Component {
  componentDidMount() {
    if (this.props.posts) return;
    this.props.fetchAllPosts()
    // ne geriausias variantas, reiketu atskiro route kur
    // pasiimam tik tam user priskirtus posts
  }

  render() {

    let posts = [];
    if (this.props.posts) {
      posts = this.props.posts.filter((post) => {
        console.log(post.user._id,this.props.auth.user._id );
        return post.user._id === this.props.auth.user._id
      }).map((post, i) => {
        return (
            <div className="post" key={i}>
              <h3>
                {post.title}
                <span onClick={()=>this.props.deletePost(post._id)}>x</span>
              </h3>
            </div>
        )
      })
    }
    console.log(posts);

    return (
        <div className="My-Posts">
          <h1>My Posts</h1>
          {posts}
          {!this.props.posts && <div>loading...</div>}
        </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    posts: state.posts
  }
};
export default connect(mapStateToProps, actions)(MyPosts)