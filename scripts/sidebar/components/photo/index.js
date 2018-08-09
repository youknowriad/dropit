import { Component, createElement } from "@wordpress/element";
import { IconButton, Spinner } from "@wordpress/components";
import { createBlock } from "@wordpress/blocks";
import { withDispatch, withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { PostFeaturedImageCheck } from "@wordpress/editor";
import { compose } from "@wordpress/compose";

import "./style.scss";

class Photo extends Component {
  constructor() {
    super(...arguments);
    this.addPhoto = this.addPhoto.bind(this);
    this.uploadAndInsertPhoto = this.uploadAndInsertPhoto.bind(this);
    this.useAsAFeaturedImage = this.useAsAFeaturedImage.bind(this);
    this.state = {
      loading: false,
      image: null
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
    if (this.state.image) {
      return Promise.resolve(this.state.image);
    }
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

    return this.props.api
      .download(photo.downloadLink, photo.id, {
        type: photo.mimeType
      })
      .then(file => {
        return createMediaFromFile(file).then(image => {
          this.setState({
            loading: false,
            image
          });

          return image;
        });
      });
  }

  uploadAndInsertPhoto() {
    const { photo } = this.props;
    this.uploadPhoto().then(image => {
      const block = createBlock("core/image", {
        id: image.id,
        url: image.source_url,
        link: image.link,
        caption: this.getPhotoCaption(photo),
        alt: photo.title
      });
      this.props.insertBlock(block);
    });
  }

  useAsAFeaturedImage() {
    this.uploadPhoto().then(image => {
      this.props.updateFeaturedImage(image.id);
    });
  }

  render() {
    const { photo, api, featuredImageId } = this.props;
    const { loading, image } = this.state;
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
              <PostFeaturedImageCheck>
                <IconButton
                  className="button"
                  icon="format-image"
                  onClick={this.useAsAFeaturedImage}
                  label={__("Use a featured image", "dropit")}
                  disabled={image && featuredImageId === image.id}
                />
              </PostFeaturedImageCheck>
            )}
            {api.download && (
              <IconButton
                className="button"
                icon="upload"
                onClick={this.uploadAndInsertPhoto}
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

export default compose(
  withSelect(select => ({
    featuredImageId: select("core/editor").getEditedPostAttribute(
      "featured_media"
    )
  })),
  withDispatch(dispatch => ({
    insertBlock: dispatch("core/editor").insertBlock,
    updateFeaturedImage(imageId) {
      dispatch("core/editor").editPost({ featured_media: imageId });
    }
  }))
)(Photo);
