// Add a tail to every post from tail.md
// Great for adding copyright info
var fs = require('fs');
hexo.extend.filter.register('before_post_render', function(data, callback){
    if(data.copyright == false){
        callback(null, data);
        return;
    }
            
    fs.readFile('tail.md', function(err, file_content){
        if(!err && data.content.length > 50) data.content += file_content;
        callback(null, data);
    });
});
