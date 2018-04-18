import { Component } from "@wordpress/element";
import { IconButton, Spinner } from "@wordpress/components";
import { createBlock } from "@wordpress/blocks";
import { withDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import "./style.scss";
import { downloadPhoto } from "../../api";

class PhotoList extends Component {
  constructor() {
    super(...arguments);
    this.addPhoto = this.addPhoto.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.state = {
      loading: false
    };
  }

  getPhotoCaption(photo) {
    return [
      __("Photo by", "dropit") + " ",
      <a
        key="link"
        href={`https://unsplash.com/@${
          photo.user.username
        }?utm_source=dropit&utm_medium=referral`}
      >
        {photo.user.name}
      </a>,
      " " + __("on", "dropit") + " ",
      <a
        key="link2"
        href="https://unsplash.com/?utm_source=dropit&utm_medium=referral"
      >
        Unsplash
      </a>
    ];
  }

  addPhoto() {
    const { photo } = this.props;
    const block = createBlock("core/image", {
      url: photo.urls.regular,
      caption: this.getPhotoCaption(photo)
    });
    this.props.insertBlock(block);
  }

  uploadPhoto() {
    const { photo } = this.props;
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
    this.setState({ loading: true });

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
        this.setState({ loading: false });
      });
    });
  }

  render() {
    const { photo } = this.props;
    const { loading } = this.state;
    const style = { background: photo.color };
    return (
      <div key={photo.id} className="dropit-sidebar-photo" style={style}>
        {loading && (
          <div className="dropit-sidebar-photo__spinner-container">
            <Spinner />
          </div>
        )}
        <img src={photo.urls.small} />
        {!loading && (
          <div className="dropit-sidebar-photo__toolbar">
            <IconButton
              className="button"
              icon="upload"
              onClick={this.uploadPhoto}
            />
            <IconButton isPrimary icon="plus" onClick={this.addPhoto} />
          </div>
        )}
      </div>
    );
  }
}

export default withDispatch(dispatch => ({
  insertBlock: dispatch("core/editor").insertBlock
}))(PhotoList);
