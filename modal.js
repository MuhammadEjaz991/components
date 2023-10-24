const [modalOpen, setModalOpen] = useState(false)


{
    modalOpen && (
      <div

        onClick={handleBackgroundClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Box sx={{ display: 'flex' }}>

          <CircularProgress />
        </Box>
      </div>
    )
  }