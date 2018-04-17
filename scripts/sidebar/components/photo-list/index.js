import { Component } from "@wordpress/element";

import Photo from "../photo";
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
      <div>{photos.map(photo => <Photo key={photo.id} photo={photo} />)}</div>
    );
  }
}

export default PhotoList;
