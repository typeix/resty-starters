import {fakeHttpServer} from "@typeix/resty";
import {Application} from "../application";


describe("Home controller", () => {



  function template(title, name, id) {
    // eslint-disable-next-line max-len
    return `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>${title}</title>\n</head>\n<body>\n<h4>Headline: ${name}</h4>\n<p>\n    Action id: ${id} name: ${name} <- Before each core &lt;- Before cache controller filter &lt;-null;\n</p>\n</body>\n</html>\n`;
  }

  test("Should test index action", (done) => {
    fakeHttpServer(Application).GET("/").then(data => {
      expect(data.getBody().toString()).toEqual(template("Home page example", "this is home page", "NO_ID"));
      done();
    }).catch(done);
  });


  test("Should test home id action", (done) => {
    fakeHttpServer(Application).GET("/params/100/whatevericansee").then(data => {
      expect(data.getBody().toString()).toEqual(template("Template engine with typeix", "whatevericansee", "100"));
      done();
    }).catch(done);
  });
});
