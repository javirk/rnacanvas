import createUsToTsButtonForApp from './createUsToTsButtonForApp';
import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';

it('creates with key and text', () => {
  let app = new App(() => NodeSVG());
  let b = createUsToTsButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Us to Ts');
});

describe('onClick callback', () => {
  it('drawing has lowercase and uppercase Ts but no Us', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('qwer', 'qtasas');
    drawing.appendSequenceOutOfView('asdf', 'asTTzx');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = createUsToTsButtonForApp(app);
    b.props.onClick();
    expect(spy1).not.toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('qtasasasTTzx');
    expect(spy2).not.toHaveBeenCalled();
  });

  it('drawing has lowercase and uppercase Us', () => {
    let app = new App(() => NodeSVG());
    let drawing = app.strictDrawing.drawing;
    drawing.appendSequenceOutOfView('zxas', 'zxUiUsss');
    drawing.appendSequenceOutOfView('qwer', 'quweurb');
    let spy1 = jest.spyOn(app, 'pushUndo');
    let spy2 = jest.spyOn(app, 'drawingChangedNotByInteraction');
    let b = createUsToTsButtonForApp(app);
    b.props.onClick();
    expect(spy1).toHaveBeenCalled();
    expect(drawing.overallCharacters).toBe('zxTiTsssqtwetrb');
    expect(spy2).toHaveBeenCalled();
  });
});
