/*global define, describe, it, expect */
define([
  'usermanagement/widgets/datecell/DateCell',
  'identitymgmtlib/SystemTime'
], function(DateCell, systemTime) {
  'use strict';

  describe('DateCell', function() {

    //variables
    var sandbox, dateCell;

    beforeEach(function() {
      //Setup to prepare fake stuffs
      sandbox = sinon.sandbox.create();
      dateCell = new DateCell();
    });

    afterEach(function() {
      sandbox.restore();
    });

    describe('setValue()', function() {
//      it('Should return date/time in UTC converted to DTSZ (en-us format)', function() {
//
//        systemTime.updateTimezone('Europe/Dublin');
//        dateCell.setValue('20150701152828+0000');
//
//        var cellText = dateCell.view.getElement().getText().replace(/-/g, '/');
//        var expectedText = '2015-07-01 16:28:28 GMT+1';
//        if ( dateCell.view.getElement().getText() !== expectedText )  {
//            console.log("Unexpected Data Format: is " + dateCell.view.getElement().getText() + " expected " + expectedText);
//            expect( Date.parse(cellText) ).to.equal(Date.parse('2015-07-01 16:28:28'));
//        }
//      });
//
//      it('Should return date/time in GMT+2 converted to DSTZ (en-us format)', function() {
//
//        systemTime.updateTimezone('Europe/Dublin');
//        dateCell.setValue('20150628152828+0200');
//
//        var cellText = dateCell.view.getElement().getText().replace(/-/g, '/');
//        var expectedText = '2015/06/28 14:28:28 GMT+1';
//        if ( dateCell.view.getElement().getText() !== expectedText )  {
//            console.log("Unexpected Data Format: is " + dateCell.view.getElement().getText() + " expected " + expectedText);
//            expect( Date.parse(cellText) ).to.equal(Date.parse('2015/06/28 14:28:28'));
//        }
//      });

//      it('Should return date/time in UTC converted to DSTZ (en-us format)', function() {
//
//        systemTime.updateTimezone('America/Chicago');
//
//        dateCell.setValue('20190628152828+0000');
//
//        expect(dateCell.view.getElement().getText()).to.equal('2019-06-28 17:28:28 GMT+0200');
//      });
    });

  });
});