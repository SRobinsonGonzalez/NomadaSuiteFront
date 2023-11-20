import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AutoComplete, DatePicker, InputNumber, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredAccommodation, getLocations } from "../../redux/Actions/actions";
import SecundaryFilters from "../SecundaryFilters/SecundaryFilters";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const disabledDate = (current) => {
  return current && current < dayjs().endOf('day');
};

const SearchBar = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations);
  const [showSecundaryFilters, setShowSecundaryFilters] = useState(false);
  const [secValues, setSecValues] = useState({
    min: '',
    max: ''
  });
  const [values, setValues] = useState({
    city: '',
    country: '',
    startDate: '',
    endDate: '',
    rooms: '',
    min: 0,
    max: null
  });

  const handleSecValues = (values) => {
    setSecValues({...secValues, ...values});
  }

  const handleSecundaryFilters = () => {
    setShowSecundaryFilters(true);
  }

  const onRangeChange = (dates, dateStrings) => {
    setValues({
      ...values,
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    });
  };

  const searchHandler = (e) => {
    e.stopPropagation();
    setShowSecundaryFilters(false);
    dispatch(getFilteredAccommodation({
      ...values,
      ...secValues
    }));
  };

  const onChangeRooms = (value) => {
    setValues({
      ...values,
      rooms: value
    });
  };

  const onChange = (data) => {
    const input = data.split(',').map(item => item.trim());

    if (input.length === 2) {
      const city = input[0];
      const country = input[1];

      setValues({
        ...values,
        city: city,
        country: country
      });
    } else if (input.length === 1) {
      setValues({
        ...values,
        city: input[0],
        country: ''
      });
    }
  };

  useEffect(() => {
    dispatch(getLocations());
  }, [])

  return (
    <div>
      <div className='flex border border-gray-200 rounded-full py-2 px-4 shadow-md' onClick={(handleSecundaryFilters)}>
        <Space size={12}>
          <AutoComplete
            value={values.location}
            options={locations}
            style={{
              width: 200,
            }}
            onChange={onChange}
            placeholder="Ubicación"

            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
          <RangePicker placeholder={['Check-in', 'Check-out']} onChange={onRangeChange} disabledDate={disabledDate} />
          <InputNumber value={values.rooms} placeholder={"Habitaciones"} min={1} max={10} onChange={onChangeRooms} type='number'
            style={{
              width: 114,
            }}
          />
        </Space>
        <button className='bg-primary text-white p-2 ml-3 rounded-full' onClick={searchHandler}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>
      <SecundaryFilters handleSecValues={handleSecValues} show={showSecundaryFilters}/>
    </div>
  )
};

export default SearchBar;