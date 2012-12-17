

suite('lazyload', function() {

  //setup is called after load, so doing setup here
  var called;
  $.lazyLoad(function() { called = true; });

  setup(function() {
    $.lazyLoad.reset();
  });

  test('$.lazyLoad exists', function() {
    assert(typeof $.lazyLoad, 'function');
  });

  test('calling $.lazyLoad() returns queue', function() {
    var queue = $.lazyLoad();
    assert.equal(typeof queue, 'object');
    assert.ok(queue.load instanceof Array);
    assert.ok(queue.mouse instanceof Array);
    assert.ok(queue.scroll instanceof Array);
  });

  test('pushes an object with priority and fn', function() {
    var fn = function() {};
    $.lazyLoad(fn, 'load', 5);
    var queue = $.lazyLoad();
    assert.equal(queue.load.length, 1);
    assert.equal(queue.load[0].priority, 5);
    assert.equal(queue.load[0].fn, fn);
  });

  test('$.lazyLoad.reset() will reset queue', function() {
    var fn = function() {};
    $.lazyLoad(fn, 'load', 5);
    var queue = $.lazyLoad();
    assert.equal(queue.load.length, 1);
    $.lazyLoad.reset();
    queue = $.lazyLoad();
    assert.equal(queue.load.length, 0);
  });

  test('defaults to on load', function() {
    $.lazyLoad(function() {
      console.log('load');
    });
    var queue = $.lazyLoad();
    assert.equal(queue.load.length, 1);
    assert.equal(queue.mouse.length, 0);
    assert.equal(queue.scroll.length, 0);
  });


  test('defaults to priority of 1', function() {
    $.lazyLoad(function() {
      console.log('load');
    });
    var queue = $.lazyLoad();
    assert.equal(queue.load[0].priority, 1);
  });

  test('can pass priority without type', function() {
    $.lazyLoad(function() {
      console.log('load');
    }, 5);
    var queue = $.lazyLoad();
    assert.equal(queue.load[0].priority, 5);
  });

  test('run on load', function() {
    assert.ok(called);
  });

  test('manually run', function(done) {
    $.lazyLoad(done);
    $.lazyLoad.runQueue('load');
  });

  test('manually run, default to load', function(done) {
    $.lazyLoad(done);
    $.lazyLoad.runQueue();
  });

  test('run after load already called');

  test('grab script if callback is a string', function(done) {
    window.fixtureLoaded = done;
    $.lazyLoad('fixtures/test.js');
    $.lazyLoad.runQueue();
  });

  test('run in specific order', function(done) {
    var data = [];
    $.lazyLoad(function() {
      data.push(2);
    }, 2);

    $.lazyLoad(function() {
      data.push(1);
    }, 1);

    $.lazyLoad(function() {
      assert.deepEqual(data, [1, 2]);
      done();
    }, 3);

    $.lazyLoad.runQueue();
  });

  test('run on scroll', function(done) {
    $.lazyLoad(done, 'scroll');
    $(window).trigger('scroll');
  });

  test('run on mouse move', function(done) {
    $.lazyLoad(done, 'mouse');
    $('body').trigger('mousemove');
  });
});

