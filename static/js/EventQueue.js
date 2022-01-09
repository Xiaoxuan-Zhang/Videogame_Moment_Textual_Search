// task queue functions
var FLY_TO_TARGET = 'FLY_TO_TARGET';
var WAIT_FOR_COMPLETE = 'WAIT_FOR_COMPLETE';
var SHOW_TARGET = 'SHOW_TARGET';
var HIDE_TARGET = 'HIDE_TARGET';
///////////////////////////////////////////////////////////////////////////
// task queue handling
var EventQueue = function() {
  this.fifoQueue = [];
  this.fifoQueueCounter = 0;

  this.startTask = function(func, params) {
    var taskId = this.fifoQueue.length;
    this.fifoQueue.push({'taskId': taskId, 'function': func, 'params': params, 'completed': false});
    return taskId;
  }

  this.finishTask = function(taskId) {
    this.fifoQueue[taskId]['completed'] = true;
  }

  this.update = function() {
    if (this.fifoQueue.length > this.fifoQueueCounter) {
      var i = this.fifoQueueCounter;
      var continueUpdating = false;

      for (; i < this.fifoQueue.length; i++) {
        task = this.fifoQueue[i];
        if (task['completed'] == true) {
          continue;
        } else {
          switch (task['function']) {
            case WAIT_FOR_COMPLETE:
              //nothing to do, continue to check at next update()
              continueUpdating = true;
              break;
            case FLY_TO_TARGET:
              params = task['params'];
              cameraManager.flyToTarget(labelManager.metalabelDictionary[params[0]].labelSprite, params[1]);
              task['completed'] = true;
              break;
            case SHOW_TARGET:
              params = task['params'];
              cameraManager.showTarget(labelManager.metalabelDictionary[params[0]].labelSprite);
              task['completed'] = true;
              break;
            case HIDE_TARGET:
              params = task['params'];
              cameraManager.makeInvisible(params[0]);  // not used
              task['completed'] = true;
              break;
            default:
              console.log('MetalabelManager: update has a task function with undefined value.')
          }
          if (continueUpdating) {
            break;
          }
        }
        this.fifoQueueCounter = i;
      } // end of for loop
    } else if (this.fifoQueue.length == this.fifoQueueCounter) {
      // comment these out for debugging
      this.fifoQueue = [];  // leak?
      this.fifoQueueCounter = 0;
    }
  } // end of this.update
}
