import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { UsToTsButton } from './UsToTsButton';

describe('onClick callback', () => {
  it('drawing has lowercase and uppercase Ts but no Us', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequence('qwer', 'qtasas');
    drawing.appendSequence('asdf', 'asTTzx');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = UsToTsButton({ app: app });
    b.props.onClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qtasasasTTzx');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('drawing has lowercase and uppercase Us', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequence('zxas', 'zxUiUsss');
    drawing.appendSequence('qwer', 'quweurb');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = UsToTsButton({ app: app });
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('zxTiTsssqtwetrb');
    expect(spy2).toHaveBeenCalled();
  });
});
