/* Get the list of blog posts from mattle24_blog and insert it into a tab on the
main page */

const xhr = new XMLHttpRequest();

xhr.open('GET', '/mattle24_blog/public/index.html', true);
xhr.responseType = "document";

xhr.onload = function() {
  let body = this.responseXML.body
  // remove header
  body.querySelector("header.header").remove();
  // insert into `blog-div`
  document.getElementById("blog-div").innerHTML = body.innerHTML;
}

xhr.send();
