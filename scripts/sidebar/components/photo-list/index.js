import { Component } from "@wordpress/element";
import { IconButton } from "@wordpress/components";
import { createBlock } from "@wordpress/blocks";
import { withDispatch } from "@wordpress/data";

import "./style.scss";
import { getPhotos, downloadPhoto } from "../../api";

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

  getPhotoCaption(photo) {
    return [
      "Photo by ",
      <a
        key="link"
        href={`https://unsplash.com/@${
          photo.user.username
        }?utm_source=wpsplash&utm_medium=referral`}
      >
        ${photo.user.name}
      </a>,
      " on ",
      <a
        key="link2"
        href="https://unsplash.com/?utm_source=wpsplash&utm_medium=referral"
      >
        Unsplash
      </a>
    ];
  }

  addPhoto(photo) {
    return () => {
      const block = createBlock("core/image", {
        url: photo.urls.regular,
        caption: this.getPhotoCaption(photo)
      });
      this.props.insertBlock(block);
    };
  }

  uploadPhoto(photo) {
    return () => {
      const createMediaFromFile = file => {
        // Create upload payload
        const data = new window.FormData();
        data.append("file", file, file.name || file.type.replace("/", "."));
        return wp.apiRequest({
          path: "/wp/v2/media",
          data,
          contentType: false,
          processData: false,
          method: "POST"
        });
      };

      downloadPhoto(photo.links.download_location, photo.id, {
        type: "image/jpeg"
      }).then(file => {
        createMediaFromFile(file).then(image => {
          const block = createBlock("core/image", {
            id: image.id,
            url: image.source_url,
            link: image.link,
            caption: this.getPhotoCaption(photo)
          });
          this.props.insertBlock(block);
        });
      });
    };
  }

  render() {
    const { photos } = this.state;
    return (
      <div>
        {photos.map(photo => (
          <div key={photo.id} className="splash-sidebar-photo-list__photo">
            <img src={photo.urls.small} />

            <div className="splash-sidebar-photo-list__photo-toolbar">
              <IconButton
                className="button"
                icon="upload"
                onClick={this.uploadPhoto(photo)}
              />
              <IconButton
                isPrimary
                icon="plus"
                onClick={this.addPhoto(photo)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default withDispatch(dispatch => ({
  insertBlock: dispatch("core/editor").insertBlock
}))(PhotoList);
