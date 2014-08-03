
describe('root resource', function(req, res){
  before(function(done){
    testServer.open(done);
  });
  after(function(done){
    testServer.close(done);
  });
  it ('returns "{got here : true}"', function(done){
    apiVerity()
      .expectBody({'got here':true})
      .test(done);
  });
});
