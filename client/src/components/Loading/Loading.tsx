import { Rings } from 'react-loader-spinner'
import { Flex } from '../Util/Flex'
import { H3 } from '../Util/Typography'

// function Loading() {
//   return (
//     <FullSizeCenteredFlexBox>
//       <CircularProgress />
//     </FullSizeCenteredFlexBox>
//   );
// }

function Loading({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center my-10 bg-white opacity-75 ">
      <Flex direction="col" align="center">
        <Rings visible={true} height="80" width="80" color="#025951" ariaLabel="rings-loading" wrapperStyle={{}} wrapperClass="" />
        <H3>{message}...</H3>
      </Flex>
    </div>
  )
}

export default Loading
