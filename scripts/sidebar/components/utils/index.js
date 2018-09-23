export const isActiveSidebar = function( sidebar ) {
  if (typeof(dropit_options.modules_enabled[sidebar]) === 'undefined') {
    return false;
  } else if(dropit_options.modules_enabled[sidebar] !== '1') {
    return false;
  } else {
    return true;
  }
}
