import { Cloudinary } from '@cloudinary/url-gen';
import { max } from '@cloudinary/url-gen/actions/roundCorners';
import { saturation, contrast } from '@cloudinary/url-gen/actions/adjust';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { image } from '@cloudinary/url-gen/qualifiers/source';
import { fill } from '@cloudinary/url-gen/actions/resize';
import '@lottiefiles/lottie-player';

const buttonUpload = document.getElementById('button-upload');
const imgWrapper = document.getElementById('img-wrapper');
const downloadBtn = document.getElementById('download-btn');
const lottieWrapper = document.getElementById('lottie-wrapper');
const spinner = document.getElementById('spinner');

const bgImgId = 'ggnkp0jbxri3vhmqgkzf';

spinner.style.display = 'none';

const uploadWidget = cloudinary.createUploadWidget(
  {
    cloudName: 'ashishimages',
    uploadPreset: 'ss2022dp',
    sources: ['local', 'camera'],
    multiple: false,
    clientAllowedFormats: 'image',
    maxImageFileSize: '1500000',
    minImageWidth: 800,
    minImageHeight: 800,
    cropping: true,
    croppingAspectRatio: 1,
    croppingDefaultSelectionRatio: 1,
    croppingShowDimensions: true,
    croppingShowBackButton: true,
    croppingValidateDimensions: true,
  },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      const imageId = result.info.public_id;
      transform(imageId);
    }
  }
);

buttonUpload.addEventListener(
  'click',
  function () {
    uploadWidget.open();
  },
  false
);

const cld = new Cloudinary({
  cloud: {
    cloudName: 'ashishimages',
  },
});

async function transform(imageId) {
  spinner.style.display = 'block';

  const uploadedImg = cld.image(imageId);
  // Transformations
  uploadedImg
    .resize(fill().height(640).width(640))
    .adjust(contrast(20))
    .adjust(saturation(-100))
    .roundCorners(max())
    .overlay(source(image(bgImgId)));

  const url = uploadedImg.toURL();

  setTimeout(() => {
    spinner.style.display = 'none';
    const imgElement = document.createElement('img');
    imgWrapper.append(imgElement);
    imgElement.src = url;
  }, 2000);

  const profileImg = await fetch(url);
  const imageBlog = await profileImg.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  setTimeout(() => {
    downloadBtn.style.opacity = 1;
    downloadBtn.href = imageURL;
    downloadBtn.download = 'profile.png';

    lottieWrapper.insertAdjacentHTML(
      'afterbegin',
      `
    <lottie-player
    src="https://assets10.lottiefiles.com/packages/lf20_rovf9gzu.json"
    background="transparent"
    speed="1"
    loop
    autoplay
  ></lottie-player>`
    );
  }, 500);
}
