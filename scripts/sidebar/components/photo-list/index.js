import { Component } from "@wordpress/element";

import "./style.scss";
import { getPhotos } from "../../api";

class PhotoList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      photos: []
    };
  }
  componentDidMount() {
    getPhotos().then(photos => {
      this.setState({ photos });
    });
  }
  render() {
    const { photos } = this.state;
    return (
      <div>
        {photos.map(photo => (
          <a key={photo.id} className="splash-sidebar-photo-list__photo">
            <img src={photo.urls.small} />
          </a>
        ))}
      </div>
    );
  }
}

export default PhotoList;
