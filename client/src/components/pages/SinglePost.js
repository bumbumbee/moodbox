import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/postsActions';
import {Link} from 'react-router-dom';

class SinglePost extends React.Component {
  state = {
    comment: ''
  };
  onInputChange = (e) => {
    this.setState({comment: e.target.value})
  };
  onCommentSubmit = (e) => {
    e.preventDefault()
    // siunciam komentara i backend

    // surandu atidaryta post
    const pageTitle = this.props.match.params.title.replace(/-/g, ' ');
    const [post] = this.props.posts.filter((post) => {
      return post.title === pageTitle
    });
    this.props.commentPost(post._id, this.state.comment);
    this.setState({comment:''});
  };

  componentDidMount() {
    // padarius reload darom uzklausa i backend ir pasiimam viena post
    const title = this.props.match.params.title;
    if (!this.props.posts) this.props.fetchSinglePost(title)

  }

  render() {
    // kol neturim postu grazinu loading
    if (!this.props.posts) return <div>loading...</div>;

    const pageTitle = this.props.match.params.title.replace(/-/g, ' ');
    const [post] = this.props.posts.filter((post) => {
      return post.title === pageTitle
    });

    const comments = post.comments.map((comment,i)=>{
        return (
            <li key={i} className="comment">
              <h4>{comment.user.firstname}</h4>
              <p>{comment.comment}</p>
            </li>
        )
    });

    return (
        <div className="Single-Post">
          <h1>{post.title}</h1>
          <div
              style={{backgroundImage: `url(/uploads/${post.img})`}}
              className="post-image"/>
          <p className="post-content">{post.content}</p>
          <Link to={'/author/'+post.user._id}>
            <h6>Author: {post.user.firstname}</h6>
          </Link>
          <h5>
            <span onClick={() => this.props.likePost(post._id)}>
              {post.likes.includes(this.props.auth.user._id)
                  ? 'Unlike' : 'Like'}
            </span>
          </h5>
          <div className="clearfix"></div>

          <ul>
            {comments}
          </ul>

          <form onSubmit={this.onCommentSubmit}>
            <input
                value={this.state.comment}
                onChange={this.onInputChange}
                name="comment"
                placeholder="comment"
                type="text"/>
          </form>
        </div>
    );
  }
}
const mapStateToProps = ({posts, auth}) => ({posts, auth});

// const mapStateToProps = (state) =>{
//     return {
//         posts:state.posts,
//         auth:state.auth
//     }
// };

export default connect(mapStateToProps, actions)(SinglePost)