import { Component } from "@wordpress/element";
import { IconButton, Spinner } from "@wordpress/components";
import { createBlock } from "@wordpress/blocks";
import { withDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import "./style.scss";

class Photo extends Component {
  constructor() {
    super(...arguments);
    this.addPhoto = this.addPhoto.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.state = {
      loading: false
    };
  }

  getPhotoCaption(photo) {
    if (!photo.authorLink || !photo.siteLink) {
      return [];
    }
    return [
      __("Photo by", "dropit") + " ",
      <a key="link" href={photo.authorLink}>
        {photo.authorName}
      </a>,
      " " + __("on", "dropit") + " ",
      <a key="link2" href={photo.siteLink}>
        {photo.siteName}
      </a>
    ];
  }

  addPhoto() {
    const { photo } = this.props;
    const block = createBlock("core/image", {
      url: photo.viewLink,
      caption: this.getPhotoCaption(photo),
      alt: photo.title
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

    this.props.api
      .download(photo.downloadLink, photo.id, {
        type: photo.mimeType
      })
      .then(file => {
        createMediaFromFile(file).then(image => {
          const block = createBlock("core/image", {
            id: image.id,
            url: image.source_url,
            link: image.link,
            caption: this.getPhotoCaption(photo),
            alt: photo.title
          });
          this.props.insertBlock(block);
          this.setState({ loading: false });
        });
      });
  }

  render() {
    const { photo, api } = this.props;
    const { loading } = this.state;
    const style = { background: photo.color };
    return (
      <div key={photo.id} className="dropit-sidebar-photo" style={style}>
        {loading && (
          <div className="dropit-sidebar-photo__spinner-container">
            <Spinner />
          </div>
        )}
        <img src={photo.thumbnailLink} />
        {!loading && (
          <div className="dropit-sidebar-photo__toolbar">
            {api.download && (
              <IconButton
                className="button"
                icon="upload"
                onClick={this.uploadPhoto}
                label={__("Upload photo", "dropit")}
              />
            )}
            <IconButton
              isPrimary
              icon="plus"
              onClick={this.addPhoto}
              label={__("Add photo", "dropit")}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withDispatch(dispatch => ({
  insertBlock: dispatch("core/editor").insertBlock
}))(Photo);
