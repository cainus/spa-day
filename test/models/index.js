
var User;

describe('User model', function(req, res){
  before(function(done){
    setupDb(function(err){
      if (err) throw err;
      User = model('User');
      done();
    });
  });
  after(function(done){
    done();
  });
  describe("ensure", function(){
    //TODO make this broken upsert work!
    it ('creates a user if one does not exist', function(done){
      User.ensure('gregg@caines.ca', function(err, user){
        failOnError(err);
        console.log("user : ", user);
        User.findByEmailAddress('gregg@caines.ca', function(err, user){
          failOnError(err);
          console.log("found: ", user);
          done();
        });
      });
    });
  });
});
